var op = document.querySelector('.operatePanel');
var LShip = document.getElementById('launchShip');
var PowerSystem = {
    PS1: {
        speed: 30,
        consumptionRate: 5
    },
    PS2: {
        speed: 50,
        consumptionRate: 7
    },
    PS3: {
        speed: 80,
        consumptionRate: 9
    }
}
var energysystem = {
    ES1: {
        chargSpeed: 2
    },
    ES2: {
        chargSpeed: 3
    },
    ES3: {
        chargSpeed: 4
    }
}
window.shipFlg = ['1#', '2#', '3#', '4#'];
var shipOB = document.createElement('div');
var label = document.createElement('label');
var startBtn = document.createElement('input');
var stopBtn = document.createElement('input');
var destoryBtn = document.createElement('input');
startBtn.setAttribute('type', 'button');
stopBtn.setAttribute('type', 'button');
destoryBtn.setAttribute('type', 'button');
startBtn.setAttribute('value', '开始飞行');
stopBtn.setAttribute('value', '停止飞行');
destoryBtn.setAttribute('value', '销毁');
shipOB.appendChild(label);
shipOB.appendChild(startBtn);
shipOB.appendChild(stopBtn);
shipOB.appendChild(destoryBtn);
LShip.onclick = function() {
    if (window.AirshipList && window.AirshipList.length >= 4) {
        console.log('不能起飞新飞船')
    }
    else {
        var PS = document.querySelector('.PowerSystem').querySelector('input:checked').getAttribute("value");
        var ES = document.querySelector('.energysystem').querySelector('input:checked').getAttribute("value");
        if (!(PS && ES)) {
            return false
        }
        var name = window.shipFlg.shift();
        new Airship({
            centerPoint: {
                X: 250,
                Y: 300
            },
            name: name,
             chargSpeed:energysystem[ES]['chargSpeed'],
        speed:PowerSystem[PS]['speed'],
        consumptionRate: PowerSystem[PS]['consumptionRate'],
        });
        var tOB = shipOB.cloneNode(true);
        tOB.setAttribute('data', name);
        var inputs = tOB.querySelectorAll('input');
        inputs[0].onclick = function() {
            var mes = name + 'startMove'
            Mediator(mes);
        }
        inputs[1].onclick = function() {
            var mes = name + 'stopMove';
            Mediator(mes);
        }
        inputs[2].onclick = function() {
            var mes = name + 'distory';
            Mediator(mes);
        }
        tOB.querySelector('label').innerHTML = '对' + name + '飞船下达命令：'
        op.appendChild(tOB);
    }
}
function Mediator(message) {
    var mes = message;
    function sendMes() {
        window.AirshipList.forEach(function(value) {
            if (value.ReceiveSignal) {
                value.ReceiveSignal(mes);
            }
        })
    }
    if (Math.random() > 0.3) {
        setTimeout(sendMes, 1000)
    }
    else {
        console.log('失败');
    }
}
