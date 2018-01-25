module.exports = {
  "extends": "airbnb-base",
  "plugins": [
      "import"
  ],
  "rules": {
      "comma-dangle": [
          "error",
          "never"
      ],
      "no-underscore-dangle": [
          "error",
          {
              "allow": ["_id"]
          }
      ],
      "indent": [
          "error",
          2
      ],
      "linebreak-style": [
          "error",
          "unix"
      ],
      "no-console": [
          "error",
          {
              "allow": ["error"]
          }
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "always"
      ]
  }
};