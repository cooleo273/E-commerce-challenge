export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-black animate-spin"></div>
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-black/30 animate-spin absolute top-4 left-4"></div>
        <div className="h-8 w-8 rounded-full border-t-4 border-b-4 border-black/10 animate-spin absolute top-8 left-8"></div>
      </div>
    </div>
  )
}
  
  