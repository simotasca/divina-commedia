String.prototype.capitalize = function () { return this[0].toUpperCase() + this.slice(1) }
Date.prototype.format = function () { return Intl.DateTimeFormat("it-IT").format(this) }