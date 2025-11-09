'use client'

import dynamic from 'next/dynamic'

const SearchAndFilters = dynamic(() => import('@/components/home-search/SearchAndFilters'), { ssr: false })

export default function ClientSearchAndFilters() {
  return <SearchAndFilters />
}
