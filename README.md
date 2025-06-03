### 🛠️ Development Setup

1.  **Install Dependencies:**
    Make sure you have Node.js and npm (or Yarn) installed. Then, install the project dependencies:
    ```bash
    npm install
    # or if you use yarn
    # yarn install
    ```

2.  **Create Environment File:**
    Create a file named **`.env.local`** in the **root** of your project. This file will store your sensitive API keys and configuration variables.

3.  **Add Environment Variables:**
    Populate your newly created `.env.local` file with the following variables. **Remember to replace the placeholder values with your actual project IDs and keys.**

    ```env
    EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
    EXPO_PUBLIC_APPWRITE_ENDPOINT=[https://your-endpoint.appwrite.io/v1](https://your-endpoint.appwrite.io/v1)
    EXPO_PUBLIC_GOOGLE_API_KEY=your_google_api_key
    ```
    * `EXPO_PUBLIC_APPWRITE_PROJECT_ID`: Your unique project ID from Appwrite.
    * `EXPO_PUBLIC_APPWRITE_ENDPOINT`: The endpoint for your Appwrite instance.
    * `EXPO_PUBLIC_GOOGLE_API_KEY`: Your API key for Google services (e.g., Google Maps, Google Sign-in if used directly with Google APIs, not just Firebase).

4.  **Start the Development Server:**
    Once your `.env.local` is set up, you can start the Expo development server:
    ```bash
    npm run start
    ```
    This will launch the Expo Development Tools in your browser, where you can choose to open the app on an emulator/simulator, a physical device using the Expo Go app, or a [development client](https://docs.expo.dev/develop/development-builds/introduction/) if you've built one.

---
