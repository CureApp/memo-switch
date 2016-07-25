// @flow
import MemoSwitch, { Resolutions } from '../../src/memo-switch'
import assert from 'assert'


function wait(msec: number): Promise<void> {
    return new Promise((y) => setTimeout(y, msec))
}

describe('MemoSwitch', function () {

    describe('initialize', function () {

        it('initializes with empty array when no argument is given', function () {
            const memoSwitch = MemoSwitch.initialize()
            assert(memoSwitch.diffs.length === 0)
            assert(memoSwitch.isActivated === false)
        })

        it('initializes with one element when 1st arg is true', function () {
            const memoSwitch = MemoSwitch.initialize(true)
            assert(memoSwitch.diffs.length === 1)
            assert(memoSwitch.length === 1)
            assert(memoSwitch.isActivated === true)
            assert(memoSwitch.diffs[0] === 0)
        })
    })

    it('is created with object', function () {
        const memoSwitch = new MemoSwitch({ start: [2010], diffs: [1, 4] })
        assert(memoSwitch.length === 2)
    })

    it('is created with instance', function () {
        const ms1 = new MemoSwitch({ start: [2010], diffs: [1, 4] })
        const ms2 = new MemoSwitch(ms1)
        assert.deepEqual(ms1, ms2)
    })

    it('is created plain json', function () {
        const ms1 = new MemoSwitch({ start: [2010], diffs: [1, 4] })
        const ms1JSON = JSON.parse(JSON.stringify(ms1))
        const ms2 = new MemoSwitch(ms1JSON)
        assert.deepEqual(ms1, ms2)
    })

    describe('isActivated', function () {

        it('is false when array.length is 0', function () {
            const memoSwitch = MemoSwitch.initialize()
            assert(memoSwitch.isActivated === false)
        })

        it('is true when array.length is 1', function () {
            const memoSwitch = new MemoSwitch({ start: [2010], diffs: [1] })
            assert(memoSwitch.isActivated === true)
        })

        it('is true when array.length is odd', function () {
            const memoSwitch = new MemoSwitch({ start: [2010], diffs: [1, 2, 3] })
            assert(memoSwitch.isActivated === true)
        })

        it('is true when array.length is even', function () {
            const memoSwitch = new MemoSwitch({ start: [2010], diffs: [1, 2, 3, 5] })
            assert(memoSwitch.isActivated === false)
        })
    })

    describe('calcDiffByDate()', function () {
        it('calculates diff when resolution is YEAR', function () {
            const memoSwitch = MemoSwitch.initialize(false, Resolutions.YEAR)
            const nextYear = new Date(memoSwitch.startDate.getFullYear() + 1, 0)
            assert(memoSwitch.calcDiffByDate(nextYear) === 1)

            const y10 = new Date(memoSwitch.startDate.getFullYear() + 10, 0)
            assert(memoSwitch.calcDiffByDate(y10) === 10)
        })

        it('calculates diff when resolution is MONTH', function () {
            const memoSwitch = MemoSwitch.initialize(false, Resolutions.MONTH)
            const { startDate } = memoSwitch
            const y10m11 = new Date(startDate.getFullYear() + 10, startDate.getMonth() + 11)
            assert(memoSwitch.calcDiffByDate(y10m11) === 12 * 10 + 11)
        })

        it('calculates diff when resolution is DAY', function () {
            const memoSwitch = MemoSwitch.initialize(false, Resolutions.DAY)
            const { startDate } = memoSwitch
            const d100 = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 100)
            assert(memoSwitch.calcDiffByDate(d100) === 100)
        })

        it('calculates diff when resolution is HOUR', function () {
            const memoSwitch = MemoSwitch.initialize(false, Resolutions.HOUR)
            const d = memoSwitch.startDate
            const h30 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 30)
            assert(memoSwitch.calcDiffByDate(h30) === 30)
        })

        it('calculates diff when resolution is MINUTE', function () {
            const memoSwitch = MemoSwitch.initialize(false, Resolutions.MINUTE)
            const d = memoSwitch.startDate
            const m140 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 140)
            assert(memoSwitch.calcDiffByDate(m140) === 140)
        })

        it('calculates diff when resolution is SECOND', function () {
            const memoSwitch = MemoSwitch.initialize(false, Resolutions.SECOND)
            const d = memoSwitch.startDate
            const m10s70 = new Date(d.getFullYear(), d.getMonth(), d.getDate(),
                                    d.getHours(), d.getMinutes() + 10, d.getSeconds() + 70)
            assert(memoSwitch.calcDiffByDate(m10s70) === 10 * 60 + 70)
        })

        it('calculates diff when resolution is MILLISECOND', function () {
            const memoSwitch = MemoSwitch.initialize(false, Resolutions.MILLISECOND)
            const d = memoSwitch.startDate
            const s7ms125 = new Date(d.getFullYear(), d.getMonth(), d.getDate(),
                                    d.getHours(), d.getMinutes(), d.getSeconds() + 7, d.getMilliseconds() + 125)
            assert(memoSwitch.calcDiffByDate(s7ms125) === 7125)
        })
    })

    describe('getIndex()', function () {
        it('is -1 when array.length is 0', function () {
            const memoSwitch = MemoSwitch.initialize()
            assert(memoSwitch.getIndex(1) === -1)
        })

        it('is -1 when the given value is less than the first element', function () {
            const memoSwitch = new MemoSwitch({ start: [2010], diffs: [2] })
            assert(memoSwitch.getIndex(1) === -1)
        })

        it('is 0 when the given value is equal to the first element', function () {
            const memoSwitch = new MemoSwitch({ start: [2010], diffs: [2] })
            assert(memoSwitch.getIndex(2) === 0)
        })

        it('is 0 when the given value is less than the second element', function () {
            const memoSwitch = new MemoSwitch({ start: [2010], diffs: [1, 3] })
            assert(memoSwitch.getIndex(2) === 0)
        })

        it('is 1 when the given value is equal to the second element', function () {
            const memoSwitch = new MemoSwitch({ start: [2010], diffs: [1, 3] })
            assert(memoSwitch.getIndex(3) === 1)
        })

        it('is 1 when the given value is more than the second element', function () {
            const memoSwitch = new MemoSwitch({ start: [2010], diffs: [1, 3] })
            assert(memoSwitch.getIndex(5) === 1)
        })
    })

    describe('isActivatedAt()', function () {
        it('returns the state at the given datetime', async function () {
            const memoSwitch = MemoSwitch.initialize(true, 7)
            await wait(1)
            memoSwitch.toggle() // turn off
            await wait(10)
            memoSwitch.toggle() // turn on

            const firstOff = memoSwitch.getTimeAtIndex(1)
            const firstPlus1 = firstOff.getTime() + 1
            const secondOn = memoSwitch.getTimeAtIndex(2)
            const secondPlus1 = secondOn.getTime() + 1

            assert(memoSwitch.isActivatedAt(firstOff) === false)
            assert(memoSwitch.isActivatedAt(firstPlus1) === false)
            assert(memoSwitch.isActivatedAt(secondOn) === true)
            assert(memoSwitch.isActivatedAt(secondPlus1) === true)
        })

        it('returns the state at the given datetime (resolution: SECOND)', async function () {
            const memoSwitch = new MemoSwitch({
                start: [2016, 6, 12, 3, 10, 34],
                diffs: [0, 3, 5, 6, 9],
            })
            const { startTime } = memoSwitch
            assert(memoSwitch.isActivated === true)
            assert(memoSwitch.isActivatedAt(startTime) === true)
            assert(memoSwitch.isActivatedAt(startTime + 1000) === true)
            assert(memoSwitch.isActivatedAt(startTime + 2000) === true)
            assert(memoSwitch.isActivatedAt(startTime + 3000) === false)
            assert(memoSwitch.isActivatedAt(startTime + 4000) === false)
            assert(memoSwitch.isActivatedAt(startTime + 4999) === false)
            assert(memoSwitch.isActivatedAt(startTime + 5000) === true)
        })

        it('returns the state at the given datetime (resolution: MINUTE)', async function () {
            const memoSwitch = new MemoSwitch({
                start: [2016, 6, 12, 3, 10],
                diffs: [0, 3, 5, 6, 9],
            })
            const { startTime } = memoSwitch
            assert(memoSwitch.isActivated === true)
            assert(memoSwitch.isActivatedAt(startTime) === true)
            assert(memoSwitch.isActivatedAt(startTime + 60000) === true)
            assert(memoSwitch.isActivatedAt(startTime + 120000) === true)
            assert(memoSwitch.isActivatedAt(startTime + 180000) === false)
            assert(memoSwitch.isActivatedAt(startTime + 240000) === false)
            assert(memoSwitch.isActivatedAt(startTime + 299999) === false)
            assert(memoSwitch.isActivatedAt(startTime + 300000) === true)
        })

        it('returns the state at the given datetime (resolution: HOUR)', async function () {
            const memoSwitch = new MemoSwitch({
                start: [2016, 6, 12, 3, 10],
                diffs: [0, 3, 5, 6, 9],
            })
            const { startTime } = memoSwitch
            assert(memoSwitch.isActivated === true)
            assert(memoSwitch.isActivatedAt(startTime) === true)
            assert(memoSwitch.isActivatedAt(startTime + 60000) === true)
            assert(memoSwitch.isActivatedAt(startTime + 120000) === true)
            assert(memoSwitch.isActivatedAt(startTime + 180000) === false)
            assert(memoSwitch.isActivatedAt(startTime + 240000) === false)
            assert(memoSwitch.isActivatedAt(startTime + 299999) === false)
            assert(memoSwitch.isActivatedAt(startTime + 300000) === true)
        })

        it('returns the state at the given datetime (resolution: DAY)', async function () {
            const memoSwitch = new MemoSwitch({
                start: [2016, 6, 12],
                diffs: [0, 3, 5, 6, 9],
            })
            const day1 = 86400000
            const { startTime } = memoSwitch
            assert(memoSwitch.isActivated === true)
            assert(memoSwitch.isActivatedAt(startTime) === true)
            assert(memoSwitch.isActivatedAt(startTime + day1 * 2) === true)
            assert(memoSwitch.isActivatedAt(startTime + day1 * 3) === false)
            assert(memoSwitch.isActivatedAt(startTime + day1 * 4) === false)
            assert(memoSwitch.isActivatedAt(startTime + day1 * 5 - 1) === false)
            assert(memoSwitch.isActivatedAt(startTime + day1 * 5) === true)
        })

        it('returns the state at the given datetime (resolution: MONTH)', async function () {
            const memoSwitch = new MemoSwitch({
                start: [2016, 6],
                diffs: [0, 3, 5, 6, 9],
            })
            const day1 = 86400000
            const { startTime } = memoSwitch
            assert(memoSwitch.isActivated === true)
            assert(memoSwitch.isActivatedAt(startTime) === true)
            assert(memoSwitch.isActivatedAt(startTime + day1 * 30) === true)
            assert(memoSwitch.isActivatedAt(startTime + day1 * 93) === false)
            assert(memoSwitch.isActivatedAt(startTime + day1 * 150) === false)
            assert(memoSwitch.isActivatedAt(startTime + day1 * 155) === true)
        })

        it('returns the state at the given datetime (resolution: YEAR)', async function () {
            const memoSwitch = new MemoSwitch({
                start: [2006],
                diffs: [0, 3, 5, 6, 9],
            })
            assert(memoSwitch.isActivated === true)
            assert(memoSwitch.isActivatedAt(new Date(2008, 11)) === true)
            assert(memoSwitch.isActivatedAt(new Date(2009, 0)) === false)
            assert(memoSwitch.isActivatedAt(new Date(2010, 11)) === false)
            assert(memoSwitch.isActivatedAt(new Date(2011, 0)) === true)
            assert(memoSwitch.isActivatedAt(new Date(2012, 0)) === false)
            assert(memoSwitch.isActivatedAt(new Date(2013, 0)) === false)
            assert(memoSwitch.isActivatedAt(new Date(2015, 0)) === true)
        })
    })

    describe('toggle()', function () {
        it('removes the last element when the last timestamp is the same as now', function () {
            const memoSwitch = MemoSwitch.initialize(true, Resolutions.YEAR)
            assert(memoSwitch.length === 1)
            assert(memoSwitch.isActivated === true)
            memoSwitch.toggle()
            assert(memoSwitch.length === 0)
            assert(memoSwitch.isActivated === false)
        })

        it('adds the new timestamp when the last timestamp is before now', async function () {
            const memoSwitch = MemoSwitch.initialize(true, Resolutions.MILLISECOND)
            assert(memoSwitch.length === 1)
            assert(memoSwitch.isActivated === true)
            await wait(1)
            memoSwitch.toggle()
            assert(memoSwitch.length === 2)
            assert(memoSwitch.diffs[1] > 0)
            assert(memoSwitch.diffs[1] < 100)
            assert(memoSwitch.isActivated === false)
        })
    })

    describe('$toggle()', function () {
        it('create toggled new instance (remove)', function () {
            const memoSwitch = MemoSwitch.initialize(true, Resolutions.YEAR)
            assert(memoSwitch.length === 1)
            assert(memoSwitch.isActivated === true)
            const newSwitch = memoSwitch.$toggle()
            assert(newSwitch.length === 0)
            assert(newSwitch.isActivated === false)
            assert(memoSwitch.length === 1)
            assert(memoSwitch.isActivated === true)
        })

        it('create toggled new instance (add)', async function () {
            const memoSwitch = MemoSwitch.initialize(true, Resolutions.MILLISECOND)
            assert(memoSwitch.length === 1)
            assert(memoSwitch.isActivated === true)
            await wait(1)
            const newSwitch = memoSwitch.$toggle()

            assert(newSwitch.length === 2)
            assert(newSwitch.diffs[1] > 0)
            assert(newSwitch.diffs[1] < 100)
            assert(newSwitch.isActivated === false)

            assert(memoSwitch.length === 1)
            assert(memoSwitch.isActivated === true)
        })
    })

})
