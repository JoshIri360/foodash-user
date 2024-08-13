# Foodash

Foodash is a mobile application built with React Native and Firebase. It allows university students to explore nearby restaurants and place food orders directly from their devices.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Video Demo](#video-demo)

## Features

- Browse nearby restaurants
- View restaurant menus and details
- Place orders directly through the app
- Firebase-powered backend for real-time data and user authentication

## Installation

To get started with Foodash, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/JoshIri360/foodash-user.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd foodash
   ```

3. **Install dependencies:**

   ```bash
   yarn install
   ```

## Configuration

1. **Environment Variables:**

   Create a `.env` file in the root directory of the project and add your environment variables.

   ```
   # Example .env file
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   ```

2. **Firebase Configuration:**

   - Add `foodash-a6365-ff452045417f.json` and `google-services.json` to the `android` directory.
   - Add `GoogleService-Info.plist` to the `ios` directory.

3. **iOS Setup:**

   - Ensure you have CocoaPods installed:

     ```bash
     sudo gem install cocoapods
     ```

   - Install CocoaPods dependencies:

     ```bash
     cd ios
     pod install
     ```

## Usage

1. **Start the development server:**

   ```bash
   yarn start
   ```

2. **Run the app on an emulator or device:**

   - For iOS:

     ```bash
     yarn ios
     ```

   - For Android:

     ```bash
     yarn android
     ```

## Contributing

Contributions are welcome! Please follow these guidelines to contribute:

- Fork the repository
- Create a new branch (`git checkout -b feature/your-feature`)
- Commit your changes (`git commit -am 'Add new feature'`)
- Push to the branch (`git push origin feature/your-feature`)
- Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Video Demo

Uploading Screen Recording 2024-08-13 110403.mp4…
