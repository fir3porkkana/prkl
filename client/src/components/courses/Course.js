import React, { useState, useEffect } from "react"
import { COURSE_BY_ID } from "../../GqlQueries"

import { useQuery } from "@apollo/react-hooks"

import { Segment, Header, Grid, Dropdown, Button } from "semantic-ui-react"
import { FormattedMessage, useIntl, FormattedDate } from "react-intl"

const Course = ({ id }) => {
  const [course, setCourse] = useState({})

  const intl = useIntl()

  const { loading, error, data } = useQuery(COURSE_BY_ID, {
    variables: { id }
  })

  useEffect(() => {
    if (!loading) {
      setCourse(data.course)
      console.log("course: ", data.course)
    }
  }, [loading])

  if (loading || !course) {
    return <div>loading...</div>
  }
  return (
    <div>
      <h2>
        {course.code} - {course.title}
      </h2>
      <Header as="h4" color="red">
        <FormattedMessage id="course.deadline" />
        <FormattedDate value={course.deadline} />
      </Header>
      <div>{course.description}</div>
      <h3>
        <FormattedMessage id="course.questionsPreface" />
      </h3>

      {course.questions &&
        course.questions.map(question => (
          <Segment key={question.name} raised>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column verticalAlign="middle">
                  <b>{question.name}</b>
                </Grid.Column>
                <Grid.Column textAlign="right">
                  <Dropdown
                    selection
                    placeholder={intl.formatMessage({
                      id: "course.multipleChoicePlaceholder"
                    })}
                    options={[
                      { key: 5, value: 5, text: 5 },
                      { key: 4, value: 4, text: 4 },
                      { key: 3, value: 3, text: 3 },
                      { key: 2, value: 2, text: 2 },
                      { key: 1, value: 1, text: 1 }
                    ]}
                  ></Dropdown>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        ))}

      <h3>
        <FormattedMessage id="course.gradeQuestion" />
      </h3>
      <Dropdown
        selection
        placeholder={intl.formatMessage({
          id: "course.multipleChoicePlaceholder"
        })}
        options={[
          {
            key: 1,
            value: 1,
            text: intl.formatMessage({ id: "course.gradeAnswer1" })
          },
          {
            key: 2,
            value: 2,
            text: intl.formatMessage({ id: "course.gradeAnswer2" })
          },
          {
            key: 3,
            value: 3,
            text: intl.formatMessage({ id: "course.gradeAnswer3" })
          }
        ]}
      ></Dropdown>
      <div style={{ paddingTop: 20 }}>
        <Button primary>
          <FormattedMessage id="course.confirm" />
        </Button>
      </div>
    </div>
  )
}
export default Course
