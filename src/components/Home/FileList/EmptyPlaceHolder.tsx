import React from 'react'
import { Box } from '@material-ui/core'
import { styled } from '@material-ui/core/styles'
import { MdiReactIconComponentType } from 'mdi-react'

import { H2 } from 'components/gsuite-components/h2'

export { EmptyPlaceholder }

interface Props {
    icon?: MdiReactIconComponentType
    subline?: string
    title?: string
}

const EmptyPlaceholder = ({ icon, subline, title }: Props) => {
    const Icon = icon
    return (
        <Container>
            {icon && (
                //@ts-ignore
                <Icon
                    style={{
                        color: 'rgb(232, 240, 254)',
                        height: '10rem',
                        width: '10rem',
                    }}
                />
            )}
            <H2>{title}</H2>
            <div>{subline && subline}</div>
        </Container>
    )
}

const Container = styled(Box)({
    alignContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 100,
})
