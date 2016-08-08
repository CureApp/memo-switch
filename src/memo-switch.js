// @flow

export const Resolutions = {
    YEAR: 1,
    MONTH: 2,
    DAY: 3,
    HOUR: 4,
    MINUTE: 5,
    SECOND: 6,
    MILLISECOND: 7,
}

type TimeStamp = number
type ResoTime = Array<number>
type ResoTimeDiff = number
type DateArg = number|string|Date
type Resolution = number
type Args = {
    start: ResoTime,
    diffs: Array<ResoTimeDiff>,
}

function toResoTime(date: Date, resolution: Resolution): ResoTime {
    const resoTime = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
    ]
    return resoTime.slice(0, resolution)
}

function toDate(resoTime: ResoTime): Date {
    if (resoTime.length === 1) {
        return new Date(resoTime[0], 0) // new Date(year, 0)
    }
    return new Date(...resoTime) // new Date(year, month, ...)
}

/**
 * @class MemoSwitch
 */
export default class MemoSwitch {
    start: ResoTime;
    diffs: Array<ResoTimeDiff>;

    /**
     * Create a new instance.
     * @param {number} resolution
     */
    static initialize(isActivatedByDefault: boolean = false, resolution: Resolution = Resolutions.MINUTE): MemoSwitch {
        const start = toResoTime(new Date(), resolution)
        const diffs = isActivatedByDefault ? [0] : []
        return new MemoSwitch({ start, diffs })
    }

    /**
     * constructor
     */
    constructor({ start, diffs }: Args) {
        this.start = start
        this.diffs = diffs
    }

    /**
     * Resolution of this memoSwitch. It depends on `this.start.length`.
     */
    get resolution(): Resolution {
        if (this.start.length > 7) {
            throw new Error('invalid resolution (this.start.length > 7)')
        }
        return this.start.length
    }

    /**
     * Start date (Date)
     */
    get startDate(): Date {
        return toDate(this.start)
    }

    /**
     * Start time (timestamp)
     */
    get startTime(): TimeStamp {
        return toDate(this.start).getTime()
    }

    get isActivated(): boolean {
        return this.diffs.length % 2 === 1
    }

    get length(): number {
        return this.diffs.length
    }

    get lastTime(): ?TimeStamp {
        return this.calcTimeByDiff(this.diffs[this.length - 1])
    }

    /**
     * @public
     */
    getTimeAtIndex(index: number): Date {
        const diff = this.diffs[index]
        if (diff == null) throw new Error('invalid index')
        return new Date(this.calcTimeByDiff(diff))
    }

    /**
     * @public
     */
    isActivatedAt(dateArg: DateArg): boolean {
        const diff = this.calcDiffByDate(new Date(dateArg))
        const index = this.getIndex(diff)
        return index % 2 === 0
    }

    /**
     * @public
     * @return newState
     */
    toggle(): boolean {
        const diff = this.calcDiffByDate(new Date())
        const last = this.diffs[this.length - 1]
        if (last === diff) {
            this.diffs.pop()
        }
        else {
            this.diffs.push(diff)
        }
        return this.isActivated
    }

    /**
     * Toggle and return new instance
     */
    $toggle(): MemoSwitch {
        const clone = this.clone()
        clone.toggle()
        return clone
    }

    /**
     * Create a clone.
     */
    clone(): MemoSwitch {
        return new MemoSwitch({
            start: this.start.slice(),
            diffs: this.diffs.slice()
        })
    }

    /**
     * Calculate TimeDiff with this resolution.
     * @private
     */
    calcDiffByDate(rawDate: Date): ResoTimeDiff {
        const resoTime = toResoTime(rawDate, this.resolution)
        const date = toDate(resoTime)
        switch (this.resolution) {
        case Resolutions.YEAR:
            return date.getFullYear() - this.startDate.getFullYear()
        case Resolutions.MONTH:
            return (date.getFullYear() - this.startDate.getFullYear()) * 12 +
                    date.getMonth() - this.startDate.getMonth()
        case Resolutions.DAY:
            return (date.getTime() - this.startTime) / (24 * 3600 * 1000)
        case Resolutions.HOUR:
            return (date.getTime() - this.startTime) / (3600 * 1000)
        case Resolutions.MINUTE:
            return (date.getTime() - this.startTime) / (60 * 1000)
        case Resolutions.SECOND:
            return (date.getTime() - this.startTime) / (1000)
        case Resolutions.MILLISECOND:
        default:
            return date.getTime() - this.startTime
        }
    }

    /**
     * Calculate TimeStamp by diff and the resolution.
     * @private
     */
    calcTimeByDiff(timeDiff: ResoTimeDiff): TimeStamp {
        const start = this.start.slice()
        start[start.length - 1] = start[start.length - 1] + timeDiff
        return new Date(...start).getTime()
    }

    /**
     * @private
     */
    getIndex(timeDiff: ResoTimeDiff): number {
        if (this.length === 0) return -1

        let left = 0
        let right = this.length

        while (left + 1 < right) {
            const i = Math.floor((left + right) / 2)
            const val = this.diffs[i]
            if (val === timeDiff) {
                return i
            }

            if (val < timeDiff) {
                left = i
            }
            else {
                right = i
            }
        }
        return (left === 0 && this.diffs[0] > timeDiff) ? -1 : left
    }
}
