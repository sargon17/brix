'use client'
import { DollarSign, Laptop2 } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProfileStore } from '@/store/profile-store'
import { useEffect, useState } from 'react'


export default function ProfileSwitcher() {
  const { profile, setProfile } = useProfileStore((state) => state)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted)
    return null


  return (
    <Tabs
      value={profile}
      onValueChange={v => setProfile(v as typeof profile)}
    >
      <TabsList>
        <TabsTrigger value="buyer" aria-label="Set user as a buyer">
          <DollarSign />
          Buyer
        </TabsTrigger>
        <TabsTrigger value="admin" aria-label="Set user as an Admin">
          <Laptop2 />
          Admin
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
