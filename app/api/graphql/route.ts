import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { gql } from 'graphql-tag'
import fetch from 'node-fetch'

const OMDB_API_KEY = process.env.OMDB_API_KEY
const OMDB_API_URL = 'http://www.omdbapi.com/'
const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_API_URL = 'https://api.themoviedb.org/3'

// Defining GraphQL schema
const typeDefs = gql`
  type Movie {
    imdbID: ID!
    Title: String!
    Year: String!
    Type: String!
    Poster: String
  }

  type SearchResult {
    Search: [Movie]
    totalResults: String
    Response: String
  }

  type Query {
    searchMovies(title: String!, year: String, page: Int): SearchResult
    trendingMovies(page: Int): SearchResult
    suggestions(value: String!): [String]
  }
`

// Provide resolvers for the schema
const resolvers = {
  Query: {
    searchMovies: async (_: any, args: { title: string; year?: string; page?: number }) => {
      try {
        const response = await fetch(
          `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(args.title)}&type=movie${args.year ? `&y=${args.year}` : ''}${args.page ? `&page=${args.page}` : ''}`
        )
        const data = await response.json()
        return data
      } catch (error) {
        console.error('Error fetching movies:', error)
        return { Search: [], totalResults: '0', Response: 'False' }
      }
    },
    trendingMovies: async (_: any, args: { page?: number }) => {
      try {
        const page = args.page || 1
        const tmdbResponse = await fetch(`${TMDB_API_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=${page}`)
        const tmdbData = await tmdbResponse.json()

        const moviePromises = tmdbData.results.map(async (movie: any) => {
          const omdbResponse = await fetch(
            `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(movie.title)}&y=${movie.release_date.split('-')[0]}`
          )
          const omdbData = await omdbResponse.json()
          return omdbData.Response === 'True' ? omdbData : null
        })

        const movies = (await Promise.all(moviePromises)).filter(Boolean)

        return {
          Search: movies,
          totalResults: tmdbData.total_results.toString(),
          Response: 'True',
        }
      } catch (error) {
        console.error('Error fetching trending movies:', error)
        return { Search: [], totalResults: '0', Response: 'False' }
      }
    },
    suggestions: async (_: any, args: { value: string }) => {
      try {
        const response = await fetch(
          `${OMDB_API_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(args.value)}&type=movie`
        )
        const data = await response.json()
        return data.Search ? data.Search.map((movie: any) => movie.Title).slice(0, 5) : []
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        return []
      }
    },
  },
}

// Initialize the Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
})

// Integrate with Next.js API routes
const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({ req, res }),
})

// Export both GET and POST methods
export async function GET(req: Request) {
  console.log('GET request received')
  return handler(req)
}

export async function POST(req: Request) {
  console.log('POST request received')
  return handler(req)
}
