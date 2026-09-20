import { useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { buildCumulativeXPData } from "./stats-utils"
import type { AppData } from "@/lib/types"

const chartConfig = {
  cumulativeXP: {
    label: "Total XP",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface XPGrowthChartProps {
  data: AppData
}

export function XPGrowthChart({ data }: XPGrowthChartProps) {
  const chartData = useMemo(() => buildCumulativeXPData(data), [data])

  // ─── EMPTY STATE ─────────────────────────────────────
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>XP Growth</CardTitle>
          <CardDescription>Your cumulative XP over time</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[240px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Log some XP to see your progress here.
          </p>
        </CardContent>
      </Card>
    )
  }

  const first = chartData[0]
  const last = chartData[chartData.length - 1]
  const totalXP = last.cumulativeXP
  const daysTracked = chartData.length

  // Compute recent trend (last 7 days)
  const weekAgo = chartData[Math.max(0, chartData.length - 8)]
  const last7 = last.cumulativeXP - weekAgo.cumulativeXP

  return (
    <Card>
      <CardHeader>
        <CardTitle>XP Growth</CardTitle>
        <CardDescription>
          Cumulative XP from {first.label} to {last.label}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 0, right: 12, top: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={40}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    const point = payload?.[0]?.payload as
                      (typeof chartData)[number] | undefined
                    return point?.dateKey ?? ""
                  }}
                  formatter={(value, _name, item) => {
                    const point = item?.payload as
                      (typeof chartData)[number] | undefined
                    if (!point) return [value, "Total XP"]
                    return [
                      <div key="tip" className="flex flex-col gap-0.5">
                        <span className="font-semibold tabular-nums">
                          {point.cumulativeXP} total XP
                        </span>
                        <span className="text-xs text-muted-foreground">
                          +{point.dailyXP} on this day
                        </span>
                      </div>,
                      "",
                    ]
                  }}
                />
              }
            />
            <defs>
              <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-cumulativeXP)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-cumulativeXP)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="cumulativeXP"
              type="monotone"
              fill="url(#fillCumulative)"
              fillOpacity={0.4}
              stroke="var(--color-cumulativeXP)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 leading-none font-medium">
              {totalXP.toLocaleString()} XP total
              {last7 > 0 && (
                <span className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />+{last7} this week
                </span>
              )}
            </div>
            <div className="text-xs leading-none text-muted-foreground">
              Tracking {daysTracked} {daysTracked === 1 ? "day" : "days"}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
