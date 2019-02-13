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

spyce::spyce() {}

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
    scard_c(0, id_list)

    py::list ret_obj
    if(_temp) spkobj_c(file.c_str(), &id_list);
    for(int i = 0; i < card_c(&id_list); i++) {
        ret_obj.append(SPICE_CELL_ELEM_I(&id_list, i));
    }

    return ret_obj;
}
