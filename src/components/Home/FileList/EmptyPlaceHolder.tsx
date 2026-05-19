
import { Box } from '@material-ui/core'
import { styled } from '@material-ui/core/styles'
import { H2 } from 'components/gsuite-components/h2'
import type { MdiReactIconComponentType } from 'mdi-react'

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
                <Icon className="text-icon-blue-light size-40"
                />
            )}
            <H2>{title}</H2>
            <div className="text-center">{subline && subline}</div>
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
