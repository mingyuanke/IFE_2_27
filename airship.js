(function() {
    function extend() {
        var args = arguments;
        if (args.length >= 1) {
            var result = {};
            for (var i = 0; i < args.length; i++) {
                if (typeof args[i] === 'object') {
                    var keys = Object.keys(args[i]);
                    for (var index in keys) {
                        result[keys[index]] = args[i][keys[index]];
                    }
                }

            }
        }
        return result;
    }
    function cssAdd(element, cssItem) {
        var NewCss = element.style.cssText + cssItem;
        element.style.cssText = NewCss;

    }
    function chargeFun() {
        if (this.options.power < 100) {
            if (this.options.power + this.options.chargSpeed < 100) {
                this.options.power = this.options.power + this.options.chargSpeed;
            }
            else {
                this.options.power = 100;
            }
            this.showText();
        }
    }
    function positionFun() {
        var leftNum = this.options.centerPoint.X - Math.cos(this.options.position) * (this.options.orbitalRadius) - 50;
        var topNum = this.options.centerPoint.Y - Math.sin(this.options.position) * (this.options.orbitalRadius) - 20;
        this.element.style.top = topNum + 'px';
        this.element.style.left = leftNum + 'px';
        var newTransform = 'transform: rotateZ(' + ((this.options.position / Math.PI) * 180 - 90) + 'deg);'
        cssAdd(this.element, newTransform);
    }
    function moveFun() {
        this.options.position = this.options.position + (this.options.speed / this.options.orbitalRadius)/5;
        if (Math.round(this.options.power- this.options.consumptionRate/5) <= 0) {
            this.stopMove();
            this.options.power = 0;
        }
        else {
            this.options.power = Math.round(this.options.power- this.options.consumptionRate/5);
        }
        this.showText();
        positionFun.apply(this);
    }
    var AirshipDefaultOptions = {
        power: 100, //百分比
        position: 0, //角度 
        chargSpeed: 2,
        orbitalRadius: 200,
        speed: 20,
        consumptionRate: 5,
        name: "A#",

    }

    function Airship(options) {
        this.options = extend(AirshipDefaultOptions, options);
        this.centerPoint = this.options.centerPoint;

        create.call(this);

        function create() {
            var AirshipDiv = document.createElement('div');
            AirshipDiv.setAttribute('class', 'airship');
            AirshipDiv.setAttribute('data', this.options.name);
            var AirshipText = document.createElement('div');
            AirshipText.setAttribute('class', 'airship-text');
            AirshipDiv.appendChild(AirshipText);
            AirshipDiv.style.top = this.options.centerPoint.Y - 20 + 'px';
            AirshipDiv.style.left = this.options.centerPoint.X - this.options.orbitalRadius - 50 + 'px';
            var newTransform = 'transform: rotateZ(' + ((this.options.position / Math.PI) * 180 - 90) + 'deg);'
            cssAdd(AirshipDiv, newTransform);
            var space = document.querySelector('.space');
            space.appendChild(AirshipDiv);
            this.element = AirshipDiv;
            this.showText();
        };
        if (!window.AirshipList) {
            window.AirshipList = [];
        }
        window.AirshipList.push(this);
        this.startCharge();
    }
    Airship.prototype = {
        'showText': function() {
            this.element.querySelector('.airship-text').innerHTML = this.options.name + '-' + this.options.power + '%';
        },
        startCharge: function() {
            if (!this.charging) {
                this.charging = setInterval(chargeFun.bind(this), 1000)
            }
        },
        stopCharge: function() {
            window.clearInterval(this.charging);
            this.charging = null;
        },
        startMove: function() {
            if (!this.moving) {
                this.moving = setInterval(moveFun.bind(this), 200);
            }
        },
        stopMove: function() {
            window.clearInterval(this.moving);
            this.moving = null;
        },
        distory: function() {
            window.shipFlg.push(this.options.name);
            this.element.parentNode.removeChild(this.element);
            var index = window.AirshipList.indexOf(this);
            window.AirshipList = window.AirshipList.slice(0, index).concat(window.AirshipList.slice(index + 1));
        },
        ReceiveSignal: function(message) {
            var match = message.match(/([1-4A]#)(.+)/)
            if (match.length === 3 && match[1] === this.options.name) {
                if (this[match[2]]) {
                    this[match[2]].call(this);
                }
            }
        }

    }
    window.Airship = Airship;
})();
