import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/context'
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts'
const Repos = () => {
  const { githubRepos } = useGlobalContext()
  let obj = {}

  githubRepos.forEach((value) => {
    const { language, stargazers_count } = value
    if (language) {
      if (!obj[language]) {
        obj[language] = { label: language, value: 1, stars: stargazers_count }
      } else {
        obj[language] = {
          ...obj[language],
          value: obj[language].value + 1,
          stars: obj[language].stars + stargazers_count,
        }
      }
    }
  })

  const mostPopular = Object.values(obj)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const mostUsed = Object.values(obj)
    .sort((a, b) => {
      return b.stars - a.stars
    })
    .map((item) => {
      return { ...item, value: item.stars }
    })

  return (
    <section className='section'>
      <Wrapper className='section-center'>
        <Pie3D data={mostPopular} />
        <Column3D data={mostPopular}></Column3D>
        <Doughnut2D data={mostUsed}></Doughnut2D>
        <Bar3D data={mostPopular}></Bar3D>
      </Wrapper>
    </section>
  )
}

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`

export default Repos
