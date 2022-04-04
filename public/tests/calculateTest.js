import calculate from '../calculate/calculate.js'

import assert from 'assert'

describe('Calculate function', () => {
    describe('should work correctly with basic expression', () => {
        it('2+4-40+8', () => {
            assert.equal(calculate("2+4-40+8"), -26)
        })
        it('2*47+7+8', () => {
            assert.equal(calculate("2*47+7+8"), 109)
        })
        describe('should work with parentheses', () => {
            it('2 * (47 + 7) + 8', () => {
                assert.equal(calculate('2*(47+7)+8'), 116)
            })
            it('2 * ((47 + 7) + 8)', () => {
                assert.equal(calculate('2*((47+7)+8)'), 124)
            })
            it('(2 * 47) + (7 + 8)', () => {
                assert.equal(calculate('(2*47)+(7+8)'), 109)
            })
        })
        
    })
    describe('should eval sqrt functions or any other function', () => {
        describe('Basic usage function', () => {
            it('sqrt', () => {
                assert.equal(calculate('sqrt(36)'), 6)
            })
            it('log', () => {
                assert.equal(calculate('ln(2)'), Math.log(2))
            })
            it('sin', () => {
                assert.equal(calculate('sin(36)'), Math.sin(36))
            })
        })
        describe('Nested expressions', () => {
            it('sqrt(36 + 8 * 12)', () => {
                assert.equal(calculate('sqrt(36+8*12)'), Math.sqrt(36 + 8 * 12))
            })
            it('ln(2 + 89 * sin(1))', () => {
                assert.equal(calculate('ln(2+89*sin(2))'), Math.log(2 + 89 * Math.sin(2)))
            })
            it('sin(2*-67/0.5+sin(0.5))+sqrt(10*4+10)+((10+8)/2)', () => {
                assert.equal(calculate('sin(2*-67/0.5+sin(0.5))+sqrt(10*4+10)+((10+8)/2)'), Math.sin(2*-67/0.5+Math.sin(0.5))+Math.sqrt(10*4+10)+((10+8)/2))
            })
        })
    })
})