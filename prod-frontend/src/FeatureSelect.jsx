import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

export default function CheckboxLabels(props) {
    let initialFeatures = { };
    for (let i = 0; i < props.features.length; i++) {
        initialFeatures[props.features[i]] = true;
    }
    const [state, setState] = React.useState({
        ...initialFeatures
    });

    React.useEffect(() => {
        props.selectTraces(state);
        // console.log(state);
    }, [state]);
    const handleChange = event => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const items = [];

    for (let i = 0; i < props.features.length; i++) {
        items.push(
        <FormControlLabel
            key={props.features[i]}
            control={
            <Checkbox 
                checked={state[props.features[i]]} 
                onChange={handleChange} 
                name={props.features[i]} />}
            label={props.features[i]}
        />
        );
    }



    return (
        <FormGroup row>
            {items}
        </FormGroup>
    );
}
