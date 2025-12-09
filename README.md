# DataVis Assignment 2# Data Visualization - Exercise 2: Interactive Scatterplot

**Author:** Yunzhuo Dong  
**Institution:** Technische Universität Dresden (TU Dresden)  
**Course:** Data Visualization  

## Project Overview

This project is a submission for **Exercise 2** of the Data Visualization course. It implements an interactive scatterplot using **D3.js (v7)** to visualize a car dataset. The visualization encodes 4 different attributes of the data using position, color, and shape channels.

### Visualization Details

The scatterplot visualizes the following 4 dimensions of the `cars.csv` dataset:

1.  **X-Axis (Position):** Horsepower (HP) - Quantitative
2.  **Y-Axis (Position):** City Miles Per Gallon (MPG) - Quantitative
3.  **Color (Hue):** Car Type (e.g., Sedan, SUV, Sports Car) - Nominal
4.  **Shape:** Drive Type (AWD vs. 2WD) - Nominal
    * **Square:** AWD (All-Wheel Drive)
    * **Circle:** 2WD (Front/Rear-Wheel Drive)

## Features

* **Interactive Hover Effects:** Hovering over a data point highlights it (enlarges the point and changes the border) while keeping other points visible.
* **Details Panel:** A side panel dynamically updates to show detailed information about the specific car when hovered.
* **Dynamic Legends:** Includes legends for both Color (Car Type) and Shape (Drive Type).
* **Data Filtering:** Automatically filters out outliers or invalid data points (e.g., MPG > 200).
* **Responsive Design:** Uses a flexible flexbox layout to align the chart and the details panel side-by-side.

## File Structure

* `index.html`: The main HTML file containing the document structure.
* `style.css`: Contains all CSS styles for layout, tooltip/panel styling, and visual states (default vs. selected).
* `main.js`: Contains the D3.js logic for data loading, processing, scales, rendering, and interaction handling.
* `cars.csv`: The dataset used for the visualization.

