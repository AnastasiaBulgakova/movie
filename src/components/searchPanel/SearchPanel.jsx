import React, { useState, useEffect, useCallback } from "react";
import './searchPanel.css';

import { AutoComplete } from 'antd';
import MovieList from "../movieList/MovieList";
import { LoadingOutlined } from "@ant-design/icons";

const SearchPanel = () => {
const [searchValue, setSearchValue] = useState('');
const [isLoading, setIsLoading] = useState(false);
 const debounce = (func, delay) => {
    let timer;
    return (...args) => { 
        if(timer) clearTimeout(timer);
        setIsLoading(true);
timer = setTimeout(() => {
    func(...args);
    setIsLoading(false);
}, delay)
    }
}
const handeSearchChange = useCallback(debounce((value) => {
    setSearchValue(value)
},1000), []);
return(
    <>
    <AutoComplete
onChange={handeSearchChange}
placeholder="Type to search..."
style={{
    width: 'calc(100% - 70px)',
    marginLeft: '35px',
    marginRight: '35px',
    marginTop:'20px'
}}/>
   {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <LoadingOutlined style={{ fontSize: '24px' }} spin />
        </div>
      ) }
       <MovieList searchValue={searchValue}/>
    </>
)
}
export default SearchPanel;