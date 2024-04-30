To do list:
1. upload a file (.csv, .txt, .jtl) to /uploads folder => DONE
2. reject upload if file extension is not in the allow list of extensions => DONE
3. update the select a file dropdown during page load and upload (successfully) => DONE
4. display scatter plot using plotly by selecting a file from dropdown
5. groupings


Something to ponder:
If the Plotly chart is not displaying large datasets with 200k rows of data, there are a few potential reasons and solutions to consider:

1.Browser Performance: Rendering large datasets can be resource-intensive for web browsers, especially when dealing with interactive charts like those created with Plotly. Some browsers may struggle to handle such large amounts of data efficiently, leading to slow performance or failure to render the chart.
Solution: Consider optimizing the data before rendering it in the chart. You can downsample or aggregate the data to reduce its size while preserving important trends and patterns. Additionally, consider implementing data pagination or virtualization techniques to load and display only a subset of the data at a time.
2. Memory Limitations: Browsers have memory limitations, and attempting to load and render a large dataset can exceed these limits, causing the browser to crash or become unresponsive.
Solution: Break down the dataset into smaller chunks or batches and load them incrementally. This approach can help prevent memory overload and improve the responsiveness of the chart. You can also explore server-side data processing options to handle large datasets more efficiently.
3. Plotly Configuration: Plotly provides various configuration options for optimizing chart performance, such as setting the plotlyConfig object with parameters like responsive, staticPlot, and scrollZoom.
Solution: Experiment with different configuration options to find the optimal settings for your chart and dataset. For example, enabling staticPlot mode can improve performance for static charts that don't require interactivity.
4. Data Filtering and Aggregation: Instead of plotting the entire dataset at once, consider implementing data filtering and aggregation techniques to visualize specific subsets of the data or aggregated metrics.
Solution: Allow users to interactively filter the data based on criteria such as time range, category, or other relevant dimensions. Aggregating data into summary statistics or using heatmap visualizations can also help convey insights from large datasets more effectively.
Client-Side vs. Server-Side Rendering: Depending on the size and complexity of your dataset, consider whether client-side rendering (in the browser) or server-side rendering (on the server before sending to the client) is more suitable.
Solution: For extremely large datasets, server-side rendering may be more appropriate, as it offloads the computational burden from the client's browser. However, this approach may require additional infrastructure and development effort to implement.