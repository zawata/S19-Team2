#include <boost/filesystem.hpp>

#include "SpiceUsr.h"

#include "spyce.hpp"
#include "spyce_exceptions.hpp"

#define SPYCE_OBJECTS_MAX 100

Frame::Frame(SpiceDouble *frame) {
    this->x  = frame[0];
    this->y  = frame[1];
    this->z  = frame[2];
    this->dx = frame[3];
    this->dy = frame[4];
    this->dz = frame[5];
}

Frame::Frame() {
    this->x  = 0;
    this->y  = 0;
    this->z  = 0;
    this->dx = 0;
    this->dy = 0;
    this->dz = 0;
}

// Error Handling
//https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/error.html
spyce::spyce() {
    erract_c("SET", 0, "RETURN"); // disable "exit on error"
    errprt_c("SET", 0, "NONE");   // don't print anything
    errdev_c("SET", 0, "NULL")    // in case something is printed, send it nowhere.
}

//Give the user to chance to set a log file.
spyce::spyce(std::string log_file) {
    erract_c("SET", 0, "RETURN");         // disable "exit on error"
    errprt_c("SET", 0, "ALL");            // print everything
    errdev_c("SET", 0, log_file.c_str()); // in case something is printed, send it to the user file.
}

void spyce::_set_file(std::string s) {
    if(!boost::filesystem::exists(s))
        throw FileNotFoundException();
    file = s;
}

std::string spyce::_get_file() { return file; }

void spyce::add_kernel(std::string s) {
    furnsh_c(s.c_str());
}

void spyce::remove_kernel(std::string s) {
    unload_c(s.c_str());
}

namespace py = boost::python;
py::list spyce::get_objects() {
    //NOTE: this cell is static per the macro definition
    SPICEINT_CELL(id_list, SPYCE_OBJECTS_MAX);

    //have to reset the cell so data doesn't persist per call
    scard_c(0, &id_list);

    py::list ret_obj;
    spkobj_c(file.c_str(), &id_list);
    for(int i = 0; i < card_c(&id_list); i++) {
        ret_obj.append(SPICE_CELL_ELEM_I(&id_list, i));
    }

    return ret_obj;
}

int spyce::str_to_id(std::string naif_id) {
    int  id_code;
    SpiceBoolean found;
    bodn2c_c(naif_id.c_str(), &id_code, &found);

    if(!found)
        throw IDNotFoundException();

    return id_code;
}

Frame spyce::get_frame_data(int target_id, int observer_id, double e_time) {
    SpiceDouble frame[6] = {0};
    SpiceDouble lt;

    spkez_c(
        target_id,   // target
        e_time,      // epoch time
        "J2000",     // reference frame, TODO: J2000 vs ECLIPJ2000 frame?
        "NONE",      // Aberration correction setting. TODO: correct for light time?
        observer_id, // observer reference
        frame,       // output frame
        &lt);        // output light time

    return Frame(frame);
}