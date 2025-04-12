import React, { useEffect, useState } from "react";
import ApiServ from "../../services/ApiServ";
import { LoadingOutlined } from "@ant-design/icons";
import { Pagination } from "antd";
import "./movieCard.css";
import ErrorIndicator from "../errorIndicator/ErrorIndicator";
import MovieItem from "../movieItem/MovieItem";

const MovieCard = ({ searchValue }) => {
  const swapiServce = ApiServ();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [noMovieError, setNoMovieError] = useState(false);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [guestSessionId, setGuestSessionId] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const genresData = await swapiServce.getGenre();
        const genresMap = {};
        genresData.genres.forEach((genre) => {
          genresMap[genre.id] = genre.name;
        });
        setGenres(genresMap);

        const sessionId = await swapiServce.startGuestSession();
        setGuestSessionId(sessionId);
        localStorage.setItem("guestSessionId", sessionId);
      } catch (e) {
        setErr(true);
      }
    };

    init();
    window.addEventListener("online", handleConnectionStatus);
    window.addEventListener("offline", handleConnectionStatus);
    return () => {
      window.removeEventListener("online", handleConnectionStatus);
      window.removeEventListener("offline", handleConnectionStatus);
    };
  }, []);

  useEffect(() => {
    if (searchValue) {
      setCurrentPage(1);
      fetchMovies(searchValue, 1);
    }
  }, [searchValue]);

  const handleConnectionStatus = () => {
    setIsOffline(!navigator.onLine);
  };

  const fetchMovies = async (query, page) => {
    setLoading(true);
    setErr(false);
    setNoMovieError(false);

    try {
      const response = await swapiServce.getMovie(query, page);

      if (response.results && response.results.length > 0) {
        setMovies(response.results);
        setPages(response.total_pages);
        setNoMovieError(false);
      } else {
        setMovies([]);
        setNoMovieError(true);
      }
    } catch (e) {
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  const addToRated = (movieId, rating) => {
    if (!guestSessionId) return;
    return swapiServce.rateMovie(movieId, rating, guestSessionId).catch(() => (
      <ErrorIndicator />
    ));
  };

  // === UI ===

  if (isOffline) {
    return (
      <div className="offline-indicator">
        <h3>No Internet Connection</h3>
        <p>Please check your network and try again.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <LoadingOutlined style={{ fontSize: "50px" }} spin />
      </div>
    );
  }

  if (err) {
    return <ErrorIndicator />;
  }

  if (noMovieError) {
    return (
      <div>
        <p>There's no such movie</p>
      </div>
    );
  }

  if (searchValue && movies.length > 0) {
    return (
      <>
        {movies.map((movie) => (
          <MovieItem
            key={movie.id}
            movie={movie}
            genres={genres}
            showRating={true}
            onRate={addToRated}
          />
        ))}

        <Pagination
          current={currentPage}
          total={pages * 10}
          style={{ marginBottom: "10px", textAlign: "center" }}
          onChange={(page) => {
            setCurrentPage(page);
            fetchMovies(searchValue, page);
          }}
        />
      </>
    );
  }

  return null;
};

export default MovieCard;
