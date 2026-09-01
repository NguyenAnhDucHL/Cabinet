import React from 'react'
import { Users } from '../../pages/Users'
import { CabinetPositions } from './CabinetPositions'
import { CabinetSystemConfig } from './CabinetSystemConfig'

export function CabinetAdmin({ activeTab }) {
  switch (activeTab) {
    case 0:
      return <Users />
    case 1:
      return <CabinetPositions />
    case 2:
      return <CabinetSystemConfig />
    default:
      return <Users />
  }
}
