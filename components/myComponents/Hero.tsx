"use client"
import { useEffect, useMemo, useState, type ChangeEvent } from "react"

import config from "@/config"
import { createClient } from "@/libs/supabase/client"

import CardsSection from "./CardsSection"
import { type dataItem } from "./CardComponent"

const Hero = () => {
  // change name of data table here
  const data_table_name = "example-lekplats-data"

  // 
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [allItems, setAllItems] = useState<dataItem[]>([])
  const [filteredItems, setFilteredItems] = useState<dataItem[]>([])

  useEffect(() => {
    const fetchItems = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from(data_table_name)
        .select("*")
        .order("title", { ascending: true })

      if (error) {
        console.error(`Failed to fetch ${data_table_name}:`, error.message)
        setAllItems([])
        setFilteredItems([])
        return
      }

      const rows = data ?? []
      setAllItems(rows)
      setFilteredItems(rows)
    }

    void fetchItems()
  }, [])

  const searchableValuesByItem = useMemo(() => {
    return allItems.map((item) => {
      const values = [
        item.title,
        item.category,
        item.categoryName,
        item.city,
        item.street,
        item.state,
        item.countryCode,
      ]
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.toLowerCase())

      return { item, values }
    })
  }, [allItems])

  useEffect(() => {
    const handler = setTimeout(() => {
      const normalizedSearch = searchTerm.trim().toLowerCase()

      if (!normalizedSearch) {
        setFilteredItems(allItems)
        setSuggestions([])
        return
      }

      const nextFilteredItems = searchableValuesByItem
        .filter(({ values }) =>
          values.some((value) => value.includes(normalizedSearch))
        )
        .map(({ item }) => item)

      const nextSuggestions = Array.from(
        new Set(
          allItems
            .map((item) => item.title)
            .filter(
              (title): title is string =>
                typeof title === "string" &&
                title.toLowerCase().includes(normalizedSearch)
            )
        )
      ).slice(0, 6)

      setFilteredItems(nextFilteredItems)
      setSuggestions(nextSuggestions)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [allItems, searchableValuesByItem, searchTerm])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    setSuggestions([])
  }

  return (
    <>
      <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
        <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start backgroundcolor">
          <div>
            <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4 mb-4">
              Hitta {config.appName} <br></br> nära dig
            </h1>
          </div>
          <div className="max-w-100">Hitta hundrastgårdar i hela Sverige genom att söka efter din stad. Få relevant information om varje rastgård så att du enkelt kan hitta en plats som passar dig och din hund. Sveriges enda webbkatalog för hundrastgårdar - skapad för att göra det enkelt för hundägare att rasta sina hundar.</div>
          <div className="relative w-full max-w-xs">
            <label className="input">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                required
                placeholder="Sök på stad..."
                value={searchTerm}
                onChange={handleInputChange}
              />
            </label>
            {suggestions.length > 0 && (
              <ul className="bg-base-200 rounded-box p-2 shadow-lg w-full max-w-xs absolute top-full left-0 z-10">
                {suggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      className="btn btn-ghost w-full justify-start"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>{" "}
        </div>
      </section>
      <CardsSection items={filteredItems} />
    </>
  )
}

export default Hero
