import { useEffect } from 'react';
import React from "react";
import { useLocation } from "react-router-dom";

export const useTitle = (title) => {
    useEffect(() => {
        title && (document.title = `${title} | Your Blog`);
    }, [title])
}

export const useQuery = () => {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }