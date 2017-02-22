exports = module.exports = MagnisesEvents;

function MagnisesEvents(user) {
  this.user = user;
}

MagnisesEvents.prototype.weight = function(events) {
  var _this = this;

  events = events.filter(function(event) {
    if (typeof _this.user.company === "object") {
      return event.company === _this.user.company._id || !event.company;
    } else {
      return event.company === _this.user.company || !event.company;
    }
  });

  return events.map(function(event) {
    return _this._mapWeight(event);
  });
};

MagnisesEvents.prototype._mapWeight = function(event) {
  event.weight = 0;

  if (event.partner) {
    event.weight += 10;
  }

  if (event.event_type && event.event_type.toLowerCase() !== 'none') {
    event.weight += 2;

    if (this.user.plus_member) {
      event.weight += 1;
    }
  }

  if (!this.user.plus_member) {
    if (event.featured) {
      event.weight += 3;
    }
  } else {
    if (event.featured) {
      event.weight += 2;
    }
  }

  if (event.event_type.toLowerCase() === 'plus exclusive') {
    event.weight += 1;
  }

  return event;
};

MagnisesEvents.prototype.sort = function(events) {
  var _this = this;

  return events.sort(function(a, b) {
    if (a.weight < b.weight) {
      return 1;
    } else if (a.weight === b.weight) {
      var aDate = _this.normalizeDate(a.end_date);
      var bDate = _this.normalizeDate(b.end_date);

      if (aDate > bDate) {
        return 1;
      } else if (aDate === bDate) {
        return 0;
      }
    }

    return -1;
  });
};


MagnisesEvents.prototype.normalizeDate = function(date) {
  if (!date) {
    date = new Date();
  } else if (typeof date === 'string') {
    date = new Date(date);
  }

  return date;
};
