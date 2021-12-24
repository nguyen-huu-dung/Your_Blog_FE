import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './index.scss';

const TriggerTooltip = ({placement, contentTooltip, contentHTML}) => {

    return (
        <OverlayTrigger
            key={placement}
            placement={placement}
            overlay={
                <Tooltip>
                {contentTooltip}
                </Tooltip>
            }
            >
            {contentHTML}
        </OverlayTrigger>
    )
}

export default TriggerTooltip;