import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

const SidebarFilters = ({ setCategory, setTag }) => {
  const [category, setCategoryState] = useState("All");
  const [tag, setTagState] = useState("All");

  const handleCategoryChange = (selectedCategory) => {
    setCategoryState(selectedCategory);
    setCategory(selectedCategory);  // Update parent state
  };

  const handleTagChange = (selectedTag) => {
    setTagState(selectedTag);
    setTag(selectedTag);  // Update parent state
  };

  return (
    <div className="filters">
      <h5>Filters</h5>

      {/* Category Filter */}
      <div>
        <h6>Category</h6>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="category-dropdown">
            {category}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleCategoryChange("Action")}>Action</Dropdown.Item>
            <Dropdown.Item onClick={() => handleCategoryChange("RPG")}>RPG</Dropdown.Item>
            <Dropdown.Item onClick={() => handleCategoryChange("Sports")}>Sports</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Tags Filter */}
      <div>
        <h6>Tags</h6>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="tag-dropdown">
            {tag}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleTagChange("Multiplayer")}>Multiplayer</Dropdown.Item>
            <Dropdown.Item onClick={() => handleTagChange("Single-player")}>Single-player</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default SidebarFilters;
