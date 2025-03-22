import { Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProductReviewsProps {
  rating: number
  reviewCount: number
}

export function ProductReviews({ rating, reviewCount }: ProductReviewsProps) {
  // Mock data for reviews
  const reviews = [
    {
      id: 1,
      author: "Mark K.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 weeks ago",
      content: "Excellent running shoes. It runs easy directly on the foot.",
      likes: 42,
      replies: 0,
    },
    {
      id: 2,
      author: "Ann B.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "3 days ago",
      content: "Good shoes",
      likes: 8,
      replies: 1,
    },
    {
      id: 3,
      author: "Andrew G.",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2 months ago",
      content: "Is it suitable for running?",
      likes: 3,
      replies: 2,
    },
  ]

  // Mock data for rating distribution
  const ratingDistribution = [
    { stars: 5, count: 25, percentage: 89 },
    { stars: 4, count: 9, percentage: 32 },
    { stars: 3, count: 4, percentage: 14 },
    { stars: 2, count: 1, percentage: 4 },
    { stars: 1, count: 1, percentage: 4 },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold">{rating}</div>
            <div className="flex justify-center md:justify-start mt-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(rating) ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                    }`}
                  />
                ))}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Based on {reviewCount} reviews</div>
          </div>
        </div>

        <div className="md:w-2/3">
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2">
                <div className="w-8 text-sm text-right">{item.stars}</div>
                <Progress value={item.percentage} className="h-2 flex-1" />
                <div className="w-8 text-sm">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={review.avatar} alt={review.author} />
                <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-medium">{review.author}</h4>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex mt-1 mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted-foreground"
                        }`}
                      />
                    ))}
                </div>
                <p className="text-sm">{review.content}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <button className="hover:text-foreground">Like ({review.likes})</button>
                  <button className="hover:text-foreground">Reply ({review.replies})</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

