const axios = require('axios')
const fs = require('fs')
const chalk = require('chalk')

const country = 'en-us'
const prefServer = 'aggramar'
const names = fs.readFileSync("./names.txt").toString().split('\r\n')
names.pop()
const servers = fs.readFileSync("./servers.txt").toString().split('\r\n')
servers.pop()
const timeout = 500

// names.forEach((name, index) => {
//   setTimeout(() => {
//     axios.head(`https://worldofwarcraft.com/${country}/character/${server}/${name.toLowerCase()}`)
//     .then(response => {
//       console.log(chalk.red(name))
//     }).catch(error => {
//       console.log(chalk.green(name))
//     })
//   }, timeout * index)
// })

test()

async function test() {
  try {
    for (let name in names) {
      let availableInServers = servers.length
      for (var server in servers) {
        let available = await nameAvailable(country, servers[server], names[name])
        if (!available) availableInServers--
      }

      let prefAvailable = await nameAvailable(country, prefServer, names[name])
      console.log(` ${names[name]} - ${prefAvailable ? chalk.green(prefServer) : chalk.red(prefServer)} - ${availableInServers >= servers.length / 2 ? chalk.green( '' + availableInServers + '/' + servers.length): chalk.yellow( '' + availableInServers + '/' + servers.length)}`)
      }
  } catch (e) {
    console.log(e)
  }
}

function nameAvailable(country, server, name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.head(`https://worldofwarcraft.com/${country}/character/${server}/${name.toLowerCase()}`)
      .then(response => {
        resolve(false)
      }).catch(error => {
        resolve(true)
      })
    }, timeout)
  })
}
