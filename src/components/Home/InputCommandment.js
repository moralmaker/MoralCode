//import fetch from 'cross-fetch';
import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function InputCommandment({ setNewc ,newc, uid}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      console.log("UIDIUDIUDIDUID:", uid)
      const response = await fetch(`http://moralcode.xyz/_db/moral/moral/com?uid=${uid}`);
      const com = await response.json();
      console.log("UIDIUDIUDIDUID:", com, response)
      const commandments = com && com.commandments;
      console.log("commandments:", commandments);
      if (active) {
        setOptions(commandments.map(c => c));
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="new commandment"
      freeSolo
      style={{ marginLeft: "5%", width: "90%" }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={(x, value) => {
        setOpen(false);
      }}
      onInputChange={(x, value) => {
        console.log("$#$#@$@", value ,newc);
        setNewc(value);
      }}
      getOptionSelected={(option, value) => option.text === value.text}
      getOptionLabel={option => option.text}
      options={options}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label="Commandments"
          fullWidth
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
}
