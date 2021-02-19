# express-json-manipulator
A backend API that creates, reads, updates, and deletes values from a JSON file that contains four whisky types.

## Installation

Use Node Package Manager to install the necessary dependencies.

```bash
npm i
```

## Usage with API development environments like Insomnia or Postman:
### Choose from 4 whisky types: _Bourbon_, _Irish_, _Japanese_, and _Scotch_ 
If you do not specify a port, 3000 is the default.

This API updates data using query parameters. Below are some examples of how to use query parameters for data requests.


* GET all whiskys: `http://localhost:3000/whiskys`
* GET individual whisky type: `http://localhost:3000/whiskys/scotch`
* POST a new whisky brand to a type: `http://localhost:3000/whiskys?type=bourbon&name=Old Crow&name=Knob Creek`
* PUT/update a whisky name from a whisky type: `http://localhost:3000/whiskys/bourbon?name=Makers&update=Makers Mark`
* DELETE a whisky name from a whisky type: `http://localhost:3000/whiskys/japanese?name=nikka`

After making your requests, the JSON file will update in real-time. Share it with your family and friends.
## Contributing
Pull requests are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)
