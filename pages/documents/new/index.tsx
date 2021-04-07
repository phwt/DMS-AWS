const DocumentNew = () => {
  return <>
    <h2 className="pb-5">Document Creation Form</h2>
    <form action="" method="post" encType="multipart/form-data">


      {/* form.name.errors  */}
      <label htmlFor="form.name.id_for_label"> form.name.label </label>
      {/* {{ form.name }} */}

      {/* {{ form.source.errors }} */}
      <label htmlFor="{{ form.source.id_for_label }}"> form.source.label </label>
      {/* form.source }} */}

      {/* {{ form.detail.errors }} */}
      <label htmlFor="{{ form.detail.id_for_label }}"> form.detail.label </label>
      {/* {{ form.detail }} */}

      {/* {{ form.file_location.errors }} */}
      <label htmlFor="{{ form.file_location.id_for_label }}"> form.file_location.label </label>
      <div className="custom-file">
        <input
          type="file"
          className="custom-file-input"
          name="{{ form.file_location.name }}"
          id="{{ form.file_location.id_for_label }}"
          value="form.file_location.value"
        />
          <label className="custom-file-label" htmlFor="customFile">Choose file</label>
          {/* {#            {{ form.file_location }}#} */}
          </div>
        <input type="submit" className="btn btn-info mt-3" value="Submit"/>
      </form>
  </>;
};

export default DocumentNew;
