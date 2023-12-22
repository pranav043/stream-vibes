import React, { useEffect, useState, useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { fetchFromAPI } from "../utils/fetchFromAPI";
import { Videos, Sidebar, Loader } from ".";

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(false);
  const counterRef = useRef(0);
  const delayTime = 500;
  const timeoutRef = useRef(null);

  useEffect(() => {
    counterRef.current += 1;
    const currentCounter = counterRef.current;

    setLoading(true);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const fetchData = async () => {
        try {
          const data = await fetchFromAPI(`search?part=snippet&q=${selectedCategory}`);

          if (currentCounter === counterRef.current) {
            setVideos(data.items);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchData();
    }, delayTime);

    return () => {
      counterRef.current += 1;
      clearTimeout(timeoutRef.current);
    };
  }, [selectedCategory, delayTime, counterRef]);

  return (
    <Stack sx={{ flexDirection: { xs: "column", md: "row" } }}>
      <Box
        sx={{
          height: { xs: "auto", md: "92vh" },
          borderRight: "1px solid #3d3d3d",
          px: { xs: 0, md: 2 },
        }}>
        <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        <Typography className="copyright" variant="body2" sx={{ mt: 1.5, color: "#fff" }}>
          Copyright © 2023 Pranav Gupta
        </Typography>
      </Box>

      <Box p={2} sx={{ overflowY: "auto", height: "90vh", flex: 2 }}>
        <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: "white" }}>
          {selectedCategory} <span style={{ color: "#FC1503" }}>videos</span>
        </Typography>

        {loading ? <Loader /> : <Videos videos={videos} />}
      </Box>
    </Stack>
  );
};

export default Feed;
