"use strict";

module.exports = class ValidationError extends Error {

    constructor(message, meta) {

        super(message);
        this.status = 400;
        this.message = message || 'Please check your submitted values.';
        this.meta = meta || {};
    }
};
