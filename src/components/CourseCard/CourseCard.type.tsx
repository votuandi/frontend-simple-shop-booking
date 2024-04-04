export type ICourseCategory = {
  id: number
  course_id: number
  name: string
  description: string
}

export type ICourseObject = {
  id: number
  course_id: number
  name: string
  description: string
}

export type ICoursePeriod = {
  id: number
  course_id: number
  type: number
  period_level: number
  name: string
  description: string
  period_details: IPeriodDetail[]
}

export type IPeriodDetail = {
  id: number
  video_url: string
  time_of_length_video: string
  title: string
}
