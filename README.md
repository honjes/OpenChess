# Open Chess

Open Chess is a Chessapp for browser, mobile and Desktop.

### !! This is a work in progress so there can be bugs and unwanted behavior !!

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)

## Installation

If you want to use the app localy or with your own instance of back4app.

```sh
git clone https://github.com/honjes/OpenChess.git
cd ./OpenChess
npm install
```

To host the app over Back4app you can just insert your ApplicationId and your clientId to the src/config.ts file

## Usage

When just want to Play you can head to `<Production Url>` and play there or download it from the Google Play Store.
Links to all downloads are in the release section of the repository.

## Support

Please [open an issue](https://github.com/honjes/OpenChess/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/honjes/OpenChess/compare/).

## Software in use

This is a vue3 + vite app.

As component Libary [equal/equal Ui](https://github.com/quatrochan/Equal) was used.

For inforcing of the chess rules [chess.js](https://github.com/jhlywa/chess.js) is used. To visualise them in vue3 an adaption of [vue-chessboard](https://github.com/vitogit/vue-chessboard) is used. <br/>To make an vue3 pwa an boilerplate and the [vite pwa plugin](https://github.com/antfu/vite-plugin-pwa) was used for the base. <br/> To have https on dev server [https-localhost](https://github.com/daquinoaldo/https-localhost) is used.
