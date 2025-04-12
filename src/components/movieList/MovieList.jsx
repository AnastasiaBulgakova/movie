import React from "react";
import MovieCard from "../movieCard/MovieCard";
import { Row } from "antd";
import "./movieList.css";
 const MovieList = ( { searchValue }) => {

    return (
      <div className="movie-list-container">
        <Row gutter={[35, 35]} justify="center">   
            <MovieCard searchValue={searchValue}/>      
        </Row>   
      </div>
    );
  }

export default MovieList;