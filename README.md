## v4-validator
Handy extensible validator.

This package is part of the [musejs](https://github.com/musejs) family of components.

This validator borrows heavily from Laravel's validator, in that it incorporates every rule present in that validator,
and implements similar functionality.  This is not, however, a direct port.  Besides the obvious difference that one is
in PHP and the other is in node.js, v4-validator's implementation logic is its own, and adheres to the conventions found
in other musejs components.

## Installation

`npm install musejs/v4-validator`

## Usage
`require('v4-validator')` yields a factory function, with the following arguments: `config`, `errorHandler`, and 'DB'.
All arguments are optional.

Once the factory function is called, it will return a V4Validator class, which you may then use to create a new
validator instance whenever you wish to validate some data.  This can be done by calling either `new V4Validator(data, rules, messages)`
or `V4Validator.make(data, rules, messages)`.

- The `data` argument is a required plain javascript object; usually the input params from a request.
- The `rules` argument is a required plain javascript object whose keys are the fields in `data` you wish to assign rules to, and the corresponding
values are either an array of rules, or a string of rules separated by a pipe ("|"). If the rule requires arguments, add a colon(":") to the end of the rule name, followed by a comma-separated list of the arguments.
- `messages` is an optional plain javascript object whose keys are the fields in `data` you wish to assign a custom message to,
and the corresponding values are a string.


### Basic Example
```
var V4Validator = require('v4-validator')();

/*
 * This data would probably come from a request, instead of laid out like this.
 * /
var data = {
    preferred_greeting: 'hello',
    secondary_greeting: 'hola',
    password: 'something',
    password_confirmation: 'something'
};

var rules = {
    preferred_greeting: 'required|string',
    secondary_greeting: ['required', 'in:hello,hola,aloha'],
    password: 'required|min:6|confirmed',
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {

    // handle err

});

```
A few things to note about this example:
- Only the `data` and `rules` are required. There are already default messages for every rule.
- Rules in this example were supplied interchangeably as either a string of combined rules, or as an array.
- The `validate` function is asynchronous.

### Rules

#### accepted
The field under validation must be yes, on, 1, or true. This is useful for validating "Terms of Service" acceptance.

#### active_url
The field under validation must be a valid, active URL (determined by sending a HEAD request).

#### after:date
The field under validation must be a value after a given date. The dates will be passed into moment.js, and must therefore be [ISO-8601](http://momentjs.com/docs/##supported-iso-8601-strings) formatted.
```
var data = {
    field_1: '2015-11-03T01:27:33.153Z'
};
var rules = {
    field_1: 'after:2015-11-02'
}
validator.validate(function(err) {
    // this will pass.
});
```

#### alpha
The field under validation must be entirely alphabetic characters.

#### alpha_num
The field under validation must be entirely alpha-numeric characters.

#### alpha_num_dash
The field under validation may have alpha-numeric characters, as well as dashes and underscores.

#### array
#### before
#### between
#### boolean
#### confirmed
#### date
#### date_format
#### different
#### digits
#### digits_between
#### email
#### exists
#### image
#### in
#### integer
#### ip
#### json
#### max
#### mimes
#### min
#### not_in
#### numeric
#### regex
#### required
#### required_if
#### required_with
#### required_with_all
#### required_without
#### required_without_all
#### same
#### size
#### string
#### timezone
#### unique
#### url


## Advanced usage

### The factory function

The full factory function with all its (optional) arguments are as follows:
```
var V4Validator = require('v4-validator')(config, errorHandler, DB);
```

`config` is an object that can be used to override the defaults used. Any and all properties supplied are optional.
Under the hood, _.defaultsDeep is used. Here's the full possible structure:
```
{
    messages: {
        [rule]: 'The message for this rule.'
    },
    rules: {
        [rule]: function(data, field, value, parameters, callback) {}
    },
    replacers: {
        [rule]: function(field, constraint) {}
    }
}
```

`errorHandler` is a function that can be used to override the default handling of errors. Whatever is returned from this
function will be passed as the error in a failed validation. The signature is as follows:
```
function(errors) {}
```

`DB` is a class adhering to inspirationjs's "DB" contract.  [babylon-db](https://github.com/musejs/babylon-db) fits right in.
Supplying this allows use of the "exists" and "unique" rules.

### Message placeholders

Every message supplied (either in the factory's `config` object or in the `messages` object in `V4Validator.make(data, rules, messages)`)
can include placeholders. Placeholders are identified by a colon (":") before it. The most commonly found placeholder in
the default messages is ":attribute", which maps to the name of the field under validation.

Whenever an error message needs to be generated for a rule, it is first passed through functions called "replacers".
These functions are keyed by the rule they run on. Additionally, there is a default replacer called before the rule-specific
replacers are called.

You may add or overwrite the default replacers with your own functions by either supplying them in the factory's `config` object,
or if you already have a `V4Validator` class, you may call the `replacer` method:
```
var V4Validator = require('../src/factory')();

V4Validator.replacer('required', function(field, constraint) {

    constraint.message = constraint.message.replace(new RegExp(':attribute'), 'XXX');
});

var data = {};

var rules = {
    field_1: 'required'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {

});
```
The above example will replace the ":attribute" placeholder with the string "field", e.g. "The XXX is required.".  The original `required` replacer
replaced ":attribute" with the field name with spaces instead of non-alphanumeric characters, e.g. "The field 1 is required.".

To overwrite the default replacer, you must first get the default replacer's key, which is actually a Symbol object (to prevent key collisions).
You may do so by first calling `V4Validator.defaultReplacerKey()`.
```
var default_replacer_key = V4Validator.defaultReplacerKey();
V4Validator.replacer(default_replacer_key, function(field, constraint) {
    // do your replacing
});

```

### Adding new rules

You may either add new rules or override existing rule implementations by supplying it in the factory's `config` object,
or if you already have a `V4Validator` class, you may call the `rule` method:
```
var V4Validator = require('v4-validator')();

V4Validator.rule('equals_something', function(data, field, value, parameters, callback) {

    callback(null, value === 'something');
});

var data = {
    field_1: 'something'
};
var rules = {
    field_1: 'equals_something'
};

var validator = V4Validator.make(data, rules);

validator.validate(function(err) {

});

```