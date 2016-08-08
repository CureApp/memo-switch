'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Resolutions = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Resolutions = exports.Resolutions = {
    YEAR: 1,
    MONTH: 2,
    DAY: 3,
    HOUR: 4,
    MINUTE: 5,
    SECOND: 6,
    MILLISECOND: 7
};

function toResoTime(date, resolution) {
    var resoTime = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
    return resoTime.slice(0, resolution);
}

function toDate(resoTime) {
    if (resoTime.length === 1) {
        return new Date(resoTime[0], 0); // new Date(year, 0)
    }
    return new (Function.prototype.bind.apply(Date, [null].concat((0, _toConsumableArray3.default)(resoTime))))(); // new Date(year, month, ...)
}

/**
 * @class MemoSwitch
 */

var MemoSwitch = function () {
    (0, _createClass3.default)(MemoSwitch, null, [{
        key: 'initialize',


        /**
         * Create a new instance.
         * @param {number} resolution
         */
        value: function initialize() {
            var isActivatedByDefault = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
            var resolution = arguments.length <= 1 || arguments[1] === undefined ? Resolutions.MINUTE : arguments[1];

            var start = toResoTime(new Date(), resolution);
            var diffs = isActivatedByDefault ? [0] : [];
            return new MemoSwitch({ start: start, diffs: diffs });
        }

        /**
         * constructor
         */

    }]);

    function MemoSwitch(_ref) {
        var start = _ref.start;
        var diffs = _ref.diffs;
        (0, _classCallCheck3.default)(this, MemoSwitch);

        this.start = start;
        this.diffs = diffs;
    }

    /**
     * Resolution of this memoSwitch. It depends on `this.start.length`.
     */
    // $FlowGetterSetterIssue


    (0, _createClass3.default)(MemoSwitch, [{
        key: 'getTimeAtIndex',


        /**
         * @public
         */
        value: function getTimeAtIndex(index) {
            var diff = this.diffs[index];
            if (diff == null) throw new Error('invalid index');
            return new Date(this.calcTimeByDiff(diff));
        }

        /**
         * @public
         */

    }, {
        key: 'isActivatedAt',
        value: function isActivatedAt(dateArg) {
            var diff = this.calcDiffByDate(new Date(dateArg));
            var index = this.getIndex(diff);
            return index % 2 === 0;
        }

        /**
         * @public
         * @return newState
         */

    }, {
        key: 'toggle',
        value: function toggle() {
            var diff = this.calcDiffByDate(new Date());
            var last = this.diffs[this.length - 1];
            if (last === diff) {
                this.diffs.pop();
            } else {
                this.diffs.push(diff);
            }
            return this.isActivated;
        }

        /**
         * Toggle and return new instance
         */

    }, {
        key: '$toggle',
        value: function $toggle() {
            var clone = this.clone();
            clone.toggle();
            return clone;
        }

        /**
         * Create a clone.
         */

    }, {
        key: 'clone',
        value: function clone() {
            return new MemoSwitch({
                start: this.start.slice(),
                diffs: this.diffs.slice()
            });
        }

        /**
         * Calculate TimeDiff with this resolution.
         * @private
         */

    }, {
        key: 'calcDiffByDate',
        value: function calcDiffByDate(rawDate) {
            var resoTime = toResoTime(rawDate, this.resolution);
            var date = toDate(resoTime);
            switch (this.resolution) {
                case Resolutions.YEAR:
                    return date.getFullYear() - this.startDate.getFullYear();
                case Resolutions.MONTH:
                    return (date.getFullYear() - this.startDate.getFullYear()) * 12 + date.getMonth() - this.startDate.getMonth();
                case Resolutions.DAY:
                    return (date.getTime() - this.startTime) / (24 * 3600 * 1000);
                case Resolutions.HOUR:
                    return (date.getTime() - this.startTime) / (3600 * 1000);
                case Resolutions.MINUTE:
                    return (date.getTime() - this.startTime) / (60 * 1000);
                case Resolutions.SECOND:
                    return (date.getTime() - this.startTime) / 1000;
                case Resolutions.MILLISECOND:
                default:
                    return date.getTime() - this.startTime;
            }
        }

        /**
         * Calculate TimeStamp by diff and the resolution.
         * @private
         */

    }, {
        key: 'calcTimeByDiff',
        value: function calcTimeByDiff(timeDiff) {
            var start = this.start.slice();
            start[start.length - 1] = start[start.length - 1] + timeDiff;
            return new (Function.prototype.bind.apply(Date, [null].concat((0, _toConsumableArray3.default)(start))))().getTime();
        }

        /**
         * @private
         */

    }, {
        key: 'getIndex',
        value: function getIndex(timeDiff) {
            if (this.length === 0) return -1;

            var left = 0;
            var right = this.length;

            while (left + 1 < right) {
                var i = Math.floor((left + right) / 2);
                var val = this.diffs[i];
                if (val === timeDiff) {
                    return i;
                }

                if (val < timeDiff) {
                    left = i;
                } else {
                    right = i;
                }
            }
            return left === 0 && this.diffs[0] > timeDiff ? -1 : left;
        }
    }, {
        key: 'resolution',
        get: function get() {
            if (this.start.length > 7) {
                throw new Error('invalid resolution (this.start.length > 7)');
            }
            return this.start.length;
        }

        /**
         * Start date (Date)
         */
        // $FlowGetterSetterIssue

    }, {
        key: 'startDate',
        get: function get() {
            return toDate(this.start);
        }

        /**
         * Start time (timestamp)
         */
        // $FlowGetterSetterIssue

    }, {
        key: 'startTime',
        get: function get() {
            return toDate(this.start).getTime();
        }

        // $FlowGetterSetterIssue

    }, {
        key: 'isActivated',
        get: function get() {
            return this.diffs.length % 2 === 1;
        }

        // $FlowGetterSetterIssue

    }, {
        key: 'length',
        get: function get() {
            return this.diffs.length;
        }

        // $FlowGetterSetterIssue

    }, {
        key: 'lastTime',
        get: function get() {
            return this.calcTimeByDiff(this.diffs[this.length - 1]);
        }
    }]);
    return MemoSwitch;
}();

exports.default = MemoSwitch;