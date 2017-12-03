var PubNub = require('pubnub'),
        fs = require('fs'),
publishConfig = {
  channel : "byd_energy_server",
  message : null
}
var stage = 0

var pubnub = new PubNub({
  publishKey : "pub-c-dff9ec49-808e-4fbb-b277-985f24bc0e3f",
  subscribeKey : "sub-c-d6aa80ce-c887-11e7-bdbe-1a1a73658562",
  uuid : "test-listener-energy-server-1234",
  ssl : true
})

pubnub.subscribe({channels: ['byd_energy_server']})

pubnub.addListener({
    status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
            var payload = {
                my: 'payload'
            }
            pubnub.publish(
                {
                    message: payload
                },
                function (status) {null}
            )
        }
    },
    message: function(message) {
      console.log(message.message)
        if ( message.message == 'Are you ok?' )
          awakening : {
            publishConfig.message = 'Yeah, I\'m alive!'
            senderData()
          }
        else if ( message.message.text == 'Here comes the data' )
          showing : {
            let logger = '',
                arr = [],
                info = {},
                size = 0
            if ( message.message.fileName.indexOf('airL6') != -1 )
              logger = 'pol_byd_Air_L6.log'
            else
              logger = 'pol_byd_Power_L6.log'
            arr = message.message.content.replace(/\n/g,'').split('\r')
            for ( let k = 0 ; k < arr.length ; k++ ) {
              if ( arr[k] != '' && arr[k].indexOf('rows affected') == -1 ) {
                let momentanium = []
                momentanium = arr[k].split(',')
                info [size] = {
                  machine : momentanium[0].replace(/[^0-9]/g,''),
                  value : momentanium[1].replace(/[^0-9.]/g,''),
                  dated : new Date(momentanium[2]).getTime()
                }
                size ++
              }
            }
            for ( let key in info ) {
              fs.appendFileSync( '/home/oee/Pulse/EnergyServer/code/' + logger , 'tt=' + info[key].dated + ',var=' + info[key].machine + ',val=' + info[key].value + '\n' )
            }
          }
    },
    presence: function(presenceEvent) {null}
})

function senderData(){
  pubnub.publish(publishConfig, function(status, response) {
    ( ! status.error ) ? stage++ : stage = 0
  })
}
