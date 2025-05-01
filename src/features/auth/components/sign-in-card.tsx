import { Card, CardTitle, CardHeader } from "@/components/ui/card"
import { DottedSeparator } from "@/components/dotted-separator"

const SignInCard = () => {
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">
          登录
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
    </Card>

  )
}

export default SignInCard