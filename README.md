## Prerequisites

- [Node.js](https://nodejs.org/) (version 12.x or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup) for React Native development
- [Android Studio](https://developer.android.com/studio) or [Xcode](https://developer.apple.com/xcode/) for mobile development

## Installation

### Backend Setup (Node.js)

1. Navigate to the `server` directory:
    ```sh
    cd server
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables by creating a `.env` file in the `server` directory:
    ```sh
    touch .env
    ```
    Add the necessary environment variables in the `.env` file:
    ```
    PORT=5000
    DB_CONNECTION_STRING=your_database_connection_string
    ```

4. Start the backend server:
    ```sh
    npm start
    ```

### Frontend Setup (React Native)

1. Navigate to the `client` directory:
    ```sh
    cd client
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the React Native development server:
    ```sh
    npm start
    ```

4. Run the application on an emulator or physical device:
    ```sh
    npx react-native run-android
    ```
    or
    ```sh
    npx react-native run-ios
    ```

## Running the Application

1. Ensure that the backend server is running by following the [Backend Setup](#backend-setup-nodejs) steps.
2. Ensure that the React Native development server is running by following the [Frontend Setup](#frontend-setup-react-native) steps.
3. Access the mobile application on your emulator or physical device.
