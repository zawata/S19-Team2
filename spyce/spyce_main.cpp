#include <boost/filesystem.hpp>

#include "SpiceUsr.h"

#include "spyce.hpp"
#include "spyce_exceptions.hpp"

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


// int main() {
//     //furnsh_c("LMAP.DP7.bsp");
//     const char *const file = "LMAP_FullTrajectory_ScienceExtension.bsp";

//     SPICEINT_CELL(id_list, 8);
//     SPICEDOUBLE_CELL( cover, 1000 );

//     spkobj_c(file, &id_list);

//     for(int i = 0; i < card_c(&id_list); i++) {
//         SpiceInt obj = SPICE_CELL_ELEM_I(&id_list, i);

//         scard_c(0, &cover); //reset coverage cell

//         std::cout << "object id: " << obj << std::endl;

//         spkcov_c(file, obj, &cover); //load coverage data of `obj` id

//         int inv_num = wncard_c(&cover);

//         std::cout << "number of intervals: " << inv_num << std::endl;

//         double beg, end;

//         wnfetd_c(&cover, 0, &beg, &end);

//         std::cout << "start: " << beg << std::endl;
//         std::cout << "end:   "   << end << std::endl;

//     }
// }