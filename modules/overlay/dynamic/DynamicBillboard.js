/**
 * @Author: Caven
 * @Date: 2021-05-05 09:16:35
 */

import { Cesium } from '@dc-modules/namespace'
import State from '@dc-modules/state/State'
import Parse from '@dc-modules/parse/Parse'
import { Util } from '@dc-modules/utils'
import { Transform } from '@dc-modules/transform'
import Overlay from '../Overlay'
import DynamicOverlay from './DynamicOverlay'

class DynamicBillboard extends DynamicOverlay {
  constructor(position, icon) {
    super()
    this._posistion = Parse.parsePosition(position)
    this._icon = icon
    this._delegate = new Cesium.Entity({ billboard: {} })
    this.type = Overlay.getOverlayType('dynamic_billboard')
    this._state = State.INITIALIZED
  }

  set icon(icon) {
    this._icon = icon
    this._delegate.billboard.image = this._icon
    return this
  }

  get icon() {
    return this._icon
  }

  set size(size) {
    if (!Array.isArray(size)) {
      throw new Error('DynamicBillboard: the size invalid')
    }
    this._size = size
    this._delegate.billboard.width = this._size[0] || 32
    this._delegate.billboard.height = this._size[1] || 32
    return this
  }

  get size() {
    return this._size
  }

  _mountedHook() {
    /**
     * set the location
     */
    this._sampledPosition.forwardExtrapolationType =
      Cesium.ExtrapolationType.HOLD
    this._startTime = Cesium.JulianDate.now()
    this._sampledPosition.addSample(
      this._startTime,
      Transform.transformWGS84ToCartesian(this._posistion)
    )
    this._delegate.position = this._sampledPosition
    this._cache.push(this._startTime)
    /**
     *  initialize the Overlay parameter
     */
    this.icon = this._icon
    this.size = this._size
  }

  /**
   *
   * @param style
   * @returns {DynamicBillboard}
   */
  setStyle(style) {
    if (!style || Object.keys(style).length === 0) {
      return this
    }
    delete style['image'] && delete style['width'] && delete style['height']
    this._style = style
    Util.merge(this._delegate.billboard, this._style)
    return this
  }
}

Overlay.registerType('dynamic_billboard')

export default DynamicBillboard
