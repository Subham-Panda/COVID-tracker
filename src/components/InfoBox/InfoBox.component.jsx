import React from 'react'
import {Card, CardContent, Typography} from '@material-ui/core'

import './InfoBox.css';

const InfoBox = ({title, cases, active, isRed, total, ...props}) => {
    return (
        <Card className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} onClick={props.onClick}>
            <CardContent>
                <Typography color="textSecondary"  className="infoBox__title">
                    {title}
                </Typography>

                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

                <Typography color="textSecondary"  className="infoBox__total
                ">
                    {total} Total
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox;