const dateFormatter = Intl.DateTimeFormat("it-IT", { dateStyle: "medium" });

String.prototype.capitalize = function () { return this[0].toUpperCase() + this.slice(1) }
Date.prototype.format = function () { return dateFormatter.format(this) }