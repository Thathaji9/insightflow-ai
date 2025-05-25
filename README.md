# InsightFlow AI - Your Data Storyteller & Dynamic Dashboard

<img width="1468" alt="Screenshot 2025-05-25 at 22 10 15" src="https://github.com/user-attachments/assets/77d4dd6e-143b-4ede-84b9-a2e55a8b9bc2" />

**InsightFlow AI** is an innovative, AI-powered web application designed to transform raw data into compelling stories and interactive dashboards. It simplifies the process of data analysis, making sophisticated insights accessible to everyone, regardless of their technical expertise. Upload your data, let the AI work its magic, and build dynamic, shareable dashboards with ease.

## ✨ Key Features

* **Intelligent Data Upload:** Seamlessly upload your datasets in common formats like CSV and JSON.
* **AI-Powered Analysis & Insights:** Leverage advanced AI capabilities to automatically analyze your data, identify key trends, patterns, and anomalies, and suggest relevant visualizations.
* **Interactive Data Preview:** Get an immediate tabular overview of your uploaded data, ensuring accuracy before analysis.
* **Intuitive Dashboard Builder:**
    * **Drag-and-Drop Widgets:** Effortlessly add and arrange various types of widgets (charts, tables, text) onto your canvas.
    * **Resizable & Customizable:** Adjust the size and configuration of each widget to perfectly fit your narrative and layout.
    * **Persistent State:** Your dashboard layout and widget settings are automatically saved locally in your browser, so your work is always there when you return.
* **Rich Visualization Library:** Utilize powerful charting libraries like D3.js and Chart.js to create stunning and informative data visualizations.
* **Fully Responsive Design:** Access and interact with your dashboards flawlessly across all devices – from large desktop monitors to tablets and smartphones.
* **Modern Tech Stack:** Built with the latest web technologies for optimal performance, scalability, and developer experience.

## 🚀 Technologies Used

* **Frontend Framework:** [Next.js](https://nextjs.org/) (App Router) - For server-side rendering, routing, and a robust React environment.
* **UI Library:** [React](https://react.dev/) - For building interactive user interfaces.
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid and consistent UI development.
* **Dashboard Grid System:** [React Grid Layout](https://react-grid-layout.github.io/react-grid-layout/examples/) - Enables the draggable and resizable widget functionality.
* **Charting & Visualization:**
    * [D3.js](https://d3js.org/) - For powerful, low-level data-driven document manipulation and custom visualizations.
    * [Chart.js](https://www.chartjs.org/) - For popular and easy-to-use chart types.
* **Data Processing:** `papaparse` (for CSV parsing), native JSON parsing.
* **AI Integration:** (Crucially, **specify what AI service/API you are using here**, e.g., OpenAI API, Google Gemini API, custom LLM, etc.)
* **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`).
* **Unique IDs:** `uuid` - For generating unique identifiers for widgets.
* **Data Persistence:** `localStorage` - For saving dashboard state in the browser.

## 📦 Installation & Local Setup

Follow these steps to get InsightFlow AI running on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url-for-insightflow-ai]
    cd insightflow-ai
    ```

2.  **Install project dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Configure Environment Variables:**
    If your AI integration requires an API key or other sensitive information, create a `.env.local` file in the root of your project:
    ```bash
    # Example for an AI API key
    NEXT_PUBLIC_AI_API_KEY=your_actual_ai_api_key_here
    # Add any other necessary environment variables here
    ```
    *(Replace `your_actual_ai_api_key_here` with your valid API key)*

4.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    The application should now be accessible at [http://localhost:3000](http://localhost:3000) in your web browser.

## 🤝 Contributing

We welcome contributions to InsightFlow AI! If you have ideas for new features, improvements, or discover any bugs, please feel free to:

1.  **Open an Issue:** Describe the bug or feature request in detail.
2.  **Submit a Pull Request:** Fork the repository, make your changes, and submit a PR for review.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
