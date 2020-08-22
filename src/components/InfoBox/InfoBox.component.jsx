import React from 'react'
import {Card, CardContent, Typography} from '@material-ui/core'

const InfoBox = ({title, cases, total}) => {
    return (
        <Card className="InfoBox">
            <CardContent>
                <Typography color="textSecondary"  className="infoBox__title">
                    {title}
                </Typography>

                <h2 className="infoBox__cases">{cases}</h2>

                <Typography color="textSecondary"  className="infoBox__total
                ">
                    {total} Total
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox;