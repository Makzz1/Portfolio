# How to Run Locally

Follow these steps to set up and run the Portfolio application on your local machine.

## Prerequisites
Ensure that you have [Node.js](https://nodejs.org/) installed along with `npm` (Node Package Manager).

## Steps

1. **Open your terminal** and navigate to the project directory:
   ```bash
   cd path/to/projects/trial
   ```

2. **Install the required dependencies** (only needed the first time, or if packages change):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **View the website**:
   After running the start command, your default web browser should automatically open `http://localhost:3000`. If it does not, manually enter the address to view your portfolio.

## Notes
- To create a production build for deployment, you can run `npm run build`.
- The application uses Tailwind CSS for styling and fetches LeetCode statistics dynamically from an external API. Make sure you have an active internet connection to see the live statistics update.
