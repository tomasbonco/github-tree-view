const { preprocess } = require("@pyoner/svelte-ts-preprocess")
import { stylus } from 'svelte-preprocess'

module.exports = {
    preprocess: [stylus(), preprocess()]
}