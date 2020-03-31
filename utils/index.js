import emoji from './emoji.js'
import fieldRegular from './fieldRegular.js'
import util from './util.js'
import socket from './webSocket.js'
import wxApi from './wxApi.js'
import localstorage from './localstorage.js'


module.exports = {
  emoji,
  fieldRegular,
  socket,
  wxApi,
  localstorage,
  ...util,
}
